(ns survey.core
  (:require [liberator.core :refer [resource defresource]]
            [compojure.core :refer [defroutes ANY]]
            [ring.middleware.params :refer [wrap-params]]
            [liberator.representation :refer [ring-response]]
            [clojure.java.io :refer [input-stream]]
            [uri.core :refer [uri->map make]]
            [clj-dbcp.core        :as cp]
            [clj-liquibase.change :as ch]
            [clj-liquibase.cli    :as cli]
            [clojure.java.io :as io]
            [clojure.data.json :as json]
            [clojure.string :refer [join split]]
            [ring.adapter.jetty :as jetty]
            [environ.core :refer [env]]
            [cheshire.core :refer :all]
            )
  (:use
   [clj-liquibase.core :only (defchangelog)])
  (:gen-class))

(require '[yesql.core :refer [defquery]])

(defn parse-int [s]
  (Integer. (re-find #"[0-9]*" s)))

(def db-url (or (env :database-url)
                "postgres://pepsi:pepsi@localhost:5432/survey"))


; Define a database connection spec. (This is standard clojure.java.jdbc.)
(def db-spec {:classname "org.postgresql.Driver"
              :subprotocol "postgresql"
              :subname (join "" ["//"
                                 (get-in (uri->map (make db-url)) [:host] "localhost")
                                 ":"
                                 (get-in (uri->map (make db-url)) [:port] "5432")
                                 (get-in (uri->map (make db-url)) [:path] "/survey")])
              :user (get (split (get-in (uri->map (make db-url))
                                        [:user-info]
                                        "pepsi:pepsi")
                                #":")
                         0)
              :password (get (split (get-in (uri->map (make db-url))
                                            [:user-info]
                                            "pepsi:pepsi")
                                    #":")
                             1)})

;;liquibase
(def ct-change1 (ch/create-table :answers
                  [[:email   [:varchar 255] :null true :pk true]
                   [:enrolled :int :null true]
                   [:graduated :int :null true]
                   [:gender :int :null true]
                   [:groupwork :int :null true]
                   [:birth :int :null true]
                   [:sent :bigint :null true]
                   ]))
(def ct-change2 (ch/add-columns :answers
                  [[:important :int :null true]
                   [:toomany :int :null true]
                   [:helps_me :int :null true]
                   [:trouble :int :null true]
                   [:support :int :null true]
                   [:conflicts :int :null true]
                   [:solve_conflicts :int :null true]
                   [:fair :int :null true]
                   [:improving :int :null true]
                   [:nps :int :null true]]))
(def ct-change3 (ch/add-columns :answers [[:exchange :int :null true]]))

; recommended: one change per changeset
(def changeset-1 ["id=1" "author=sulmanen" [ct-change1]])
(def changeset-2 ["id=2" "author=sulmanen" [ct-change2]])
(def changeset-3 ["id=3" "author=sulmanen" [ct-change3]])

; you can add more changesets later to the changelog
(defchangelog app-changelog "questionmark" [changeset-1 changeset-2 changeset-3])

(def ds (cp/make-datasource (cp/parse-url db-url)))

;write changesets
(apply cli/entry "update" {:datasource ds :changelog  app-changelog} [])

; Import the SQL query as a function.
(defquery write-answer! "survey/write_answer.sql"
  {:connection db-spec})

(defquery update-answer! "survey/update_answer.sql"
  {:connection db-spec})


(defquery read-answer "survey/read_answer.sql"
  {:connection db-spec})

(defn body-as-string [ctx]
  (if-let [body (get-in ctx [:request :body])]
    (condp instance? body
      java.lang.String body
      (slurp (io/reader body)))))

(defn parse-json [ctx]
  (when (#{:put :post} (get-in ctx [:request :request-method]))
    (try
      (if-let [body (body-as-string ctx)]
        (json/read-str body :key-fn keyword)
        {:message "No body"})
      (catch Exception e
        (.printStackTrace e)
        {:message (format "IOException: %s" (.getMessage e))}))))

(defroutes app
  (ANY "/questions" [] (resource :available-media-types ["application/json"]
                                 :handle-ok (slurp "resources/data/questionnaire.json")))
  (ANY "/answers" []
     (resource
      :allowed-methods [:post :get]
      :available-media-types ["application/json"]
      ;;      :handle-ok (read-answer)
      :handle-ok (slurp "resources/answers.json")
      :post! (fn [ctx]
               (if-let [body (body-as-string ctx)]
                 (try
                   (write-answer! (parse-string body true))
                   (catch Exception e
                     (update-answer! (parse-string body true))))))))
  (ANY "/" [] (resource :available-media-types ["text/html"]
                        :handle-ok (slurp "resources/index.html")))
  (ANY "/results" [] (resource :available-media-types ["text/html"]
                               :handle-ok (slurp "resources/results.html")))
  (ANY "/js/analysis.js" [] (resource :available-media-types ["text/javascript"]
                                      :handle-ok (slurp "js/analysis.js")))
  (ANY "/js/questionmark.js" [] (resource :available-media-types ["text/html"]
                                          :handle-ok (ring-response {:headers {"Content-Encoding" "gzip"} :body (input-stream "resources/public/questionmark.js.gz")})))
  (ANY "/aalto.svg" [] (resource :available-media-types ["image/svg+xml"]
                                 :handle-ok (slurp "resources/aalto.svg")))
  (ANY "/aaltosmall.png" [] (resource :available-media-types ["image/png"]
                                          :handle-ok (ring-response {:body (input-stream "resources/aalto.png")})))
  (ANY "/favicon.ico" [] (resource :available-media-types ["image/x-icon"]
                                          :handle-ok (ring-response {:body (input-stream "resources/favicon.ico")})))
  )

(def handler
  (-> app
      wrap-params))

(defn -main []
  (jetty/run-jetty app {:port (parse-int (env :port "3000"))}))

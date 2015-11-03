(ns survey.core
  (:require [liberator.core :refer [resource defresource]]
            [compojure.core :refer [defroutes ANY]]
            [ring.middleware.params :refer [wrap-params]]
            [clj-dbcp.core        :as cp]
            [clj-liquibase.change :as ch]
            [clj-liquibase.cli    :as cli]
            [clojure.java.io :as io]
            [clojure.data.json :as json])
  (:use
    [clj-liquibase.core :only (defchangelog)]))

(require '[yesql.core :refer [defquery]])

; Define a database connection spec. (This is standard clojure.java.jdbc.)
(def db-spec {:classname "org.postgresql.Driver"
              :subprotocol "postgresql"
              :subname "//localhost:5432/survey"
              :user "pepsi"
              :password "pepsi"})

;;liquibase
(def ct-change1 (ch/create-table :answers
                  [[:id     :int          :null false :pk true :autoinc true]
                   [:email   [:varchar 255] :null false]
                   [:enrolled :int :null true]
                   [:gender :int :null true]
                   [:groupwork :int :null true]
                   [:birth :int :null true]
                   [:sent :bigint :null false]
                   ]))

; recommended: one change per changeset
(def changeset-1 ["id=1" "author=sulmanen" [ct-change1]])


; you can add more changesets later to the changelog
(defchangelog app-changelog "questionmark" [changeset-1])

(def ds (cp/make-datasource (cp/parse-url "postgres://pepsi:pepsi@localhost:5432/survey")))

;write changesets
(apply cli/entry "update" {:datasource ds :changelog  app-changelog} [])

; Import the SQL query as a function.
(defquery write-answer! "survey/write_answer.sql"
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
      :handle-ok (read-answer)
      :post! (fn [ctx]
               (write-answer! (parse-json ctx)))))
  (ANY "/" [] (resource :available-media-types ["text/html"]
                        :handle-ok (slurp "resources/index.html")))
  (ANY "/js/questionmark.js" [] (resource :available-media-types ["text/html"]
                                          :handle-ok (slurp "resources/public/questionmark.js")))
  (ANY "/aalto.svg" [] (resource :available-media-types ["image/svg+xml"]
                                          :handle-ok (slurp "resources/public/aalto.svg")))
  )


(def handler
  (-> app
      wrap-params))

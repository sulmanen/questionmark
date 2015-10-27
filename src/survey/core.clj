(ns survey.core
  (:require [liberator.core :refer [resource defresource]]
            [compojure.core :refer [defroutes ANY]]
            [ring.middleware.params :refer [wrap-params]]
            [clojure.java.io :as io]
            [clojure.data.json :as json]))

(require '[yesql.core :refer [defquery]])

; Define a database connection spec. (This is standard clojure.java.jdbc.)
(def db-spec {:classname "org.postgresql.Driver"
              :subprotocol "postgresql"
              :subname "//localhost:5432/survey"
              :user "pepsi"
              :password "pepsi"})

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

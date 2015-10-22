(ns survey.core
    (:require [liberator.core :refer [resource defresource]]
            [ring.middleware.params :refer [wrap-params]]
            [compojure.core :refer [defroutes ANY]]))

(require '[yesql.core :refer [defquery]])

; Define a database connection spec. (This is standard clojure.java.jdbc.)
(def db-spec {:classname "org.postgresql.Driver"
              :subprotocol "postgresql"
              :subname "//localhost:5432/survey"
              :user "sulmanen"
              :password "pftvppeh"})

; Import the SQL query as a function.
(defquery write-answer "survey/write_answer.sql"
   {:connection db-spec})



(defroutes app
  (ANY "/questions" [] (resource :available-media-types ["application/json"]
                           :handle-ok (slurp "resources/data/questionnaire.json"))))

(def handler
  (-> app
      wrap-params))
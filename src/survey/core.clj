(ns survey.core
    (:require [liberator.core :refer [resource defresource]]
            [ring.middleware.params :refer [wrap-params]]
            [compojure.core :refer [defroutes ANY]]))

(defroutes app
  (ANY "/questions" [] (resource :available-media-types ["application/json"]
                           :handle-ok (slurp "resources/data/questionnaire.json"))))

(def handler
  (-> app
      wrap-params))
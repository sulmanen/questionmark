(defproject survey "0.1.0-SNAPSHOT"
  :plugins [[lein-ring "0.9.7"]
            [environ/environ.lein "0.2.1"]]
  :ring {:handler survey.core/handler
         :main survey.core}
  :description "collect survey data"
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :hooks [environ.leiningen.hooks]
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/java.jdbc "0.4.2"]
                 [org.postgresql/postgresql "9.4-1203-jdbc42"]
                 [cheshire "5.5.0"]
                 [yesql "0.5.1"]
                 [liberator "0.13"]
                 [compojure "1.3.4"]
                 [environ "0.5.0"]
                 [uri "1.1.0"]
                 [clj-dbcp      "0.8.1"]  ; to create connection-pooling DataSource
                 [clj-liquibase "0.5.3"]  ; for this library
                 [oss-jdbc      "0.8.0"]  ; for Open Source JDBC drivers
                 [ring/ring-core "1.2.1"]
                 [ring/ring-jetty-adapter "1.4.0"]]
  :uberjar-name "survey.jar"
  :main survey.core
  :aot :all)

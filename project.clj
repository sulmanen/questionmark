(defproject survey "0.1.0-SNAPSHOT"
  :plugins [[lein-ring "0.8.11"]]
  :ring {:handler survey.core/handler}
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/java.jdbc "0.4.2"]
                 [org.postgresql/postgresql "9.4-1203-jdbc42"]
                 [yesql "0.5.1"]
                 [liberator "0.13"]
                 [compojure "1.3.4"]
                 [ring/ring-core "1.2.1"]])

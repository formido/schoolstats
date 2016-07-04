(message "test")

(skewer-queue-client

(defservlet skewer text/javascript ()
  (insert-file-contents (expand-file-name "skewer.js" skewer-data-root))
  (goto-char (point-max))
  (httpd-send-header proc "text/plain" 200
		     :Access-Control-Allow-Origin "*")
  (run-hooks 'skewer-js-hook)))

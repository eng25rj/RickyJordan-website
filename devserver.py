#!/usr/bin/env python3
"""Static dev server with clean URLs: /about -> about.html."""
import http.server, socketserver, sys, os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8721
ROOT = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()

class Clean(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def send_head(self):
        path = self.translate_path(self.path.split('?')[0])
        if not os.path.isdir(path) and not os.path.splitext(path)[1] and os.path.isfile(path + '.html'):
            self.path = self.path.split('?')[0] + '.html'
        return super().send_head()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Clean) as httpd:
    print(f"serving {ROOT} on {PORT} with clean urls")
    httpd.serve_forever()

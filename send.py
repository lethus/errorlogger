import httplib, urllib
params = urllib.urlencode({'prefeitura': "Prefeitura Municipal de Pirai", 'erro': "Erro pra caramba"})
headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}
conn = httplib.HTTPConnection("localhost", 3000)
conn.request("POST", "/errors/post/", params, headers)
response = conn.getresponse()
print response.status, response.reason

data = response.read()
print data
conn.close()

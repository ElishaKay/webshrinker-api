try:
    from urllib import urlencode
except ImportError:
    from urllib.parse import urlencode

from base64 import urlsafe_b64encode
import hashlib

def webshrinker_categories_v3(access_key, secret_key, url=b"", params={}):
    params['key'] = access_key

    request = "categories/v3/{}?{}".format(urlsafe_b64encode(url).decode('utf-8'), urlencode(params, True))
    request_to_sign = "{}:{}".format(secret_key, request).encode('utf-8')
    signed_request = hashlib.md5(request_to_sign).hexdigest()

    return "https://api.webshrinker.com/{}&hash={}".format(request, signed_request)

access_key = "123xz"
secret_key = "123xz"

url = b"http://www.sbwire.com/"

def write_to_file():
	file = open("testfile.txt","w") 
	file.write(webshrinker_categories_v3(access_key, secret_key, url))

write_to_file()
import datetime
import json
from collections import OrderedDict
import os
import zipfile

def createRelease():
	version = today_version()
	create_versioned_manifest(version)
	create_zip_file(version)
	clean_up()

def today_version():
	return datetime.datetime.today().date().strftime('%Y.%m.%d')

def create_versioned_manifest(version):
	in_file = open('manifest.json', 'r')
	manifest = json.loads(in_file.read(), object_pairs_hook=OrderedDict)
	manifest['version'] = version
	manifest_json = json.dumps(manifest, indent=4, separators=(',', ': '))
	out_file = open('manifest.webapp', 'w')
	out_file.write(manifest_json)
	in_file.close()
	out_file.close()

def create_zip_file(version):
	zip_file_name = 'calculator_' + version + '.zip'
	print("creating release package " + zip_file_name)
	zip_file = zipfile.ZipFile(zip_file_name, 'w')
	file_names = ["index.html",
			 "manifest.webapp",
			 "style/style.css",
			 "images/icon128.png",
			 "images/icon512.png",
			 "scripts/buttons.js",
			 "scripts/calculation.js",
			 "scripts/queryHandling.js",
			 "scripts/resultHandling.js",
			 "scripts/scaling.js"]
	for file_name in file_names:
		zip_file.write(file_name)
	zip_file.close()

def clean_up():
	try:
		os.remove('manifest.webapp')
	except OSError:
		pass

if __name__ == '__main__':
	createRelease()

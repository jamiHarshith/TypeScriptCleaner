from flask import Flask, request, jsonify, redirect, send_file
from werkzeug.utils import secure_filename
import subprocess
import os

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'ts'}
UPLOAD_FOLDER = os.path.abspath(os.getcwd())
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def clean_code():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'input.ts'))
        return send_file(os.path.join(os.getcwd(), 'correct_code.ts'), as_attachment=True)
    return '''
    <!doctype html>
    <title>Upload new TS File</title>
    <h1>Upload new TS File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
if __name__ == '__main__':
    app.run(debug=True)

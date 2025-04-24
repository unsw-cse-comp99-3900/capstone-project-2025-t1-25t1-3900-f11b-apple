from flask import jsonify, make_response, request, Blueprint
from uuid import uuid4
from util import pass_to_google_forms

userid_handler = Blueprint("cookie_handler", __name__)

""" @cookie_handler.route('/set-cookie')
def set_cookie():
    if 'uid' not in request.cookies:
        uid = str(uuid4())
        resp = make_response(f"Set new browser_id. Value: {uid}")
        resp.set_cookie(
            'uid', 
            uid, 
            path='/', 
            max_age=60*60*24*365,
            httponly='True',
            samesite='Lax'
            )
        return resp
    return f"Cookie already set. Value: {request.cookies.get('uid')}"  """

@userid_handler.route('/user_id', methods=["POST"])
def get_id():
    user_id = request.cookies.get('user_id')
    if user_id == "null":
        user_id = "No user_id found."
    pass_to_google_forms(user_id)
    return jsonify(message="Success"), 200

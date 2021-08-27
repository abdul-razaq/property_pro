import Response from "../../helpers/responses.js";

export function RegisterUser(req, res, next) {
	if (req.errorExists) return Response.error(res, { errors: req.errors });
  console.log(req.body);
	// if not, grab the request body for the signUp details
	// send email to the email address provided with token so user can verify account.
	// talk to the service to call db function to create a new user.
	// If the service returns an error, send 500 internal server error back to the client and ask them to try again.
	// if successful, grab the returned data returned from the service and send it back to the client.
}

import passport from "passport";
/**
 * @openapi
 * /login:
 *  post:
 *   summary: Login a user
 *   description: <b>Login an existing user</b> with email and password.
 *   tags: [Authentication]
 *   requestBody:
 *    description: User credentials
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        userName:
 *         type: string
 *         description: username of the employee
 *         example: admin
 *        password:
 *         type: string
 *         description: password of the employee
 *         example: admin123
 *       required:
 *        - userName
 *        - password
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with JWT token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Authentication'
 *       example:
 *        message: Succesful. 
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All fields required.
 *    '401':
 *     description: <b>Unauthorized</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        incorrect username or password:
 *         value:
 *          message: Incorrect username or password.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */
const login = (req, res) => {
    if (!req.body.userName || !req.body.password)
      return res.status(400).json({ message: "All fields required." });
    else
      passport.authenticate("local", (err, employee, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (employee) return res.status(200).json({ token: employee.generateJwt() });
        else return res.status(401).json({ message: info.message });
      })(req, res);
};



export default {
    login,
};
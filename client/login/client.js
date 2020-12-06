const handleLogin = (e) => {
    e.preventDefault();
    $("#petMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    $('#petMessage').animate({ width: 'hide' }, 350);

    if ($("#user").val == '' || $("#pass").val() == '' || $("#pass2").val() == '' || $("#birthday").val() == '' || $("#age").val() == '') {
        handleError("All fields are required");
        return false;
    }
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
}
const handleReset = (e) => {
    e.preventDefault();

    $('#petMessage').animate({ width: 'hide' }, 350);

    if ($("#user").val == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax("POST", $("#resetForm").attr("action"), $("#resetForm").serialize(), redirect);

    return false;
}
const LoginWindow = (props) => {
    return (
            <form id="loginForm" name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="inputSubmit" type="submit" value="Sign in" />
            </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <label htmlFor="birthday">Date of Birth: </label>
            <input id="birthday" type="date" name="birthday" placeholder="1998-12-07" />
            <label htmlFor="age">Age: </label>
            <input id="age" type="number" name="age" placeholder="0" min="0" max="150" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="inputSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const PasswordReset = (props) => {
    return (
        <form id="resetForm" name="resetForm"
            onSubmit={handleReset}
            action="/resetPassword"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="inputSubmit" type="submit" value="Reset" />
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const createPasswordResetWindow = (csrf) => {
    ReactDOM.render(
        <PasswordReset csrf={csrf} />,
        document.querySelector('#content')
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const resetButton = document.querySelector("#resetPasswordButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPasswordResetWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
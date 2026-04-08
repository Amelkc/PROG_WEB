import "../style/SignupForm.css"


function SignupForm(){
    return (
        <main>
        <section>
        <h2>Create an Account</h2>
       <form>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" required></input>
                    <label htmlFor="firstname">First Name:</label>
                    <input id="firstname" type="text" required></input>
                    <label htmlFor="lastname">Last Name:</label>
                    <input id="lastname" type="text" required></input>
                    <label htmlFor="pwd">Password:</label>
                    <input id="pwd" type="password" required></input>
                    <button type="submit">Sign Up</button>
        </form>
        </section>
        </main>
    )

}

export {SignupForm}
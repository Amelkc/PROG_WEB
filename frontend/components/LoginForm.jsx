import "../style/LoginForm.css"


function LoginForm(){
    return (
        <main>
        <section>
        <h2>Welcome Back !</h2>
       <form>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" required></input>
                    <label htmlFor="pwd">Password:</label>
                    <input id="pwd" type="password" required></input>
                    <button type="submit">Login</button>
        </form>
        </section>
        </main>
    
    )

}

export {LoginForm}


/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */
addEventListener('submit', async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    //console.log(formData.get('name') + ' ' + formData.get('email'));
    if(formData.get('password') !== formData.get('passwordConfirmation')){
        //console.log("Bad password");
        createNotification("Passwords must match", 'notifications-container', false);
        return;
    }
    let userObj = {
        'name': formData.get('name'),
        'email': formData.get('email'),
        'password': formData.get('password')
    }
    
    postOrPutJSON('http://localhost:3000/api/register', 'post', userObj).then(json => {

        //console.log(json.name);
        createNotification(json.name + ' created', 'notifications-container', true);
        e.target.reset();
        return;
    })
    .catch(error => createNotification(error, 'notifications-container', false));
        
    
    

});

There are two ways you can test our program.

  

One way is directly through the heroku site, and the other way is by checking out the master branch.

  

The other way is to check out a branch, so you will be able to see the database file change when we do database logic.

  

In the website, you will only be able to see it reflected, you will not actually be able to see the file.

  

Depending on which option you want, here are the steps:

  


## Website (TA, please use other option)
[Click here](https://team20-app.herokuapp.com/)

The following information applies to both the branch method and the website:

- You must first login to see more information
- The personas that can login will either be an organization member or a TEQ member
- Depeneding on what they are, they will see different pages when they login

If you want to be a `TEQ` member, the username is `caleb` and password is also `caleb`.

This main page of interest here is the `Create` page, which will allow this `TEQ` staff to create additional accounts, whether that be another `TEQ` or another `Org` account. This will then insert it into the database, which was demonstrated in the meeting.

If you want to be a `Org` member, the username is `ralph` and password is  `qwe`.

The main role of an organization member is to upload iCARE templates, which you can do under the `Upload Files` header. Here you will choose a file, select the type of iCARE template it corresponds to, and hit upload. This will also be reflected in the database.


## Database
If you want to see how the database changes (as shown in the meeting), perform the following:

- `git clone https://github.com/CSCC01/Team20.git`
- `cd Team20`
- `npm install` # you must make sure that you have node installed
- Once everything is installed, perform `npm start`

You should see in the terminal window that the app has started

Then navigate to `http://localhost:8080/login` and you can proceed as you did in the website.

The main difference here is that when an account is created, the file `db/account.db` is modified, and when a file is uploaded, the `db/templates.db` file is changed.

We have provided you a sample iCARE files to test with.

**If you are already logged in, then our application will redirect you to the proper page you are associated with. So if I log in as a TEQ member and close the website and open it again, I will not see the login page, but rather I will be inside my home page. This is simply because we store local storage data to keep the connection connected until the user logs out***


## Tests
To run the Back-End Tests.
- `git clone https://github.com/CSCC01/Team20.git`
- `cd Team20`
- `npm install` # you must make sure that you have node installed
- `npm start` # This will execute a script to run the application
- `npm test` # In another terminal, with the application still running, run npm test.
The tests are idempotent and will have the same result everytime.
- Once everything is installed, you can stop the tests and app, and just perform `npm start`

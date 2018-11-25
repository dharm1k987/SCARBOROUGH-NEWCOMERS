
There are two ways you can test our program.

One way is directly through the heroku site (no database visible), and the other way is by checking out the master branch (database, files visble).


## Website (TA, please use other option)
[Click here](https://team20-app.herokuapp.com/)

Please note that you will **not** be able to use the query feature on the website.



## Checking Locally

Our application is divided into two: the base application and the query application. The following steps are required for both:

- `git clone https://github.com/CSCC01/Team20.git`

- `cd Team20`

- `npm install` # this will install the packages for both the basic app and the query app

- `npm start` # this will start both applications

  ​

#### Base Application

----

After you ran the checking locally steps, if base application started, you should see  `listening on port ...` in your terminal.

Navigate to `http://localhost:8080/` and you should be presented with the login page. Note, if you are already logged in, then you would be navigated to `/home` or `/home-org` automatically.

**Tests**

While keeping the originally terminal already running, in another terminal, navigate again to `Team20` and run `npm test`.


#### Business Intelligence Query Tool

------

If it works, you will see `Starting the development server...` in your terminal. Wait a few more seconds for it to still boot up. 

Then you can either navigate to `http://localhost:3000` or you can click the `Query` link on the navbar if you are logged in as a TEQ member.

**Tests**

While keeping the originally terminal already running, in another terminal, navigate again to `Team20` and run `npm test`.


#### Login Info

-----

To login as a org, use the credentials `ralph` as username, `qwe` as password.

To login as a TEQ employee, use the credentials `caleb` as both username and password.

See the acceptance tests on how to use the application.


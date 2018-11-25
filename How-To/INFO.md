
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

  ​

#### Base Application

----

Following these steps will allow you to do everything except for running queries on the database:

Assuming you have already done the steps highlighted in *Testing Locally*, you should be in the directory **Team20**,  then simply run:

`npm start`

It it works, you will see `listening on port ...` in your terminal.

Navigate to `http://localhost:8080/` and you should be presented with the login page. Note, if you are already logged in, then you would be navigated to `/home` or `/home-org` automatically.

**Tests**

While keeping the base application running, in another terminal, navigate again to `Team20` and run `npm test`. Close both terminals, and restart the base application.


#### Business Intelligence Query Tool

------

**This feature requires the base application to already be running (see next section)**

Assuming you are already in **Team20**, run:

- `cd QueryBITool`
- `npm start` # this should open a webpage localhost:3000

**Tests**

While keeping the query application running, in another terminal, navigate again to `QueryBITool` and run `npm test`.  If it asks, press `a` to run all tests.


#### Login Info

-----

To login as a org, use the credentials `ralph` as username, `qwe` as password.

To login as a TEQ employee, use the credentials `caleb` as both username and password.

See the acceptance tests on how to use the application.


# LexieLogger

Steps to run this project:

1. install node, npm, git, & git-lfs 
1. clone this repo
1. if you want to run using https, create a "ssl" folder in src and link to your fullchain cert as "cert.pem" and your key as "key.pem", otherwise edit src/site-config.json and change "Use_Https" to false
1. Run `npm i` command
1. Setup database settings inside `ormconfig.json` file (if you need to make changes. It should be fine as it is, though.)
1. Run `npm start` command

TODO: See what kind of credit I need to give Bootswatch for their Lumen theme  
TODO: Add screenshot(s) to this readme  
TODO: Clean up/organize this readme  
TODO: Quickly run through setting up LetsEncrypt and DuckDNS  
TODO: Maybe re-organize the file structure (I'm not super fond of TypeORM's generated file structure) 

I threw this together for my parents to keep track of their dog's activities (It's an older dog, and they need to log it's daily meal, medicine, and restroom habits.), but it functions as a general daily logger. I just run it off a Raspberry Pi in their house, but you can run it from anywhere*. Event types can be managed via a link at the bottom of the home page. The site name is used to navigate back to the home page from anywhere. This is a Progressive Web App*, so you can install it to the home screen of your iOS (they don't fully support all of the features of PWA's, yet), Android, Windows, etc. device as an "app" (Chrome has the most support for this, except on iOS where you have to use Safari). The site can be configured by the src/site-config.json file; The src/static/manifest.json can be used to configure the PWA aspects.  

** Its ability to function as a Progressive Web App requires it to be hosted as HTTPS (which you can fairly easily achieve with LetsEncrypt); The HTTPS certificate provider, and the ability to run it from anywhere, depend on you using a dynamic DNS (if your router doesn't have a static IP from your ISP). Obviously, you can just use it as a web app, and run it from your local area network, and you don't have to worry about getting a certificate or using a dynamic DNS.  

This is my first time using an ORM, and I didn't spend a ton of time on this app, so if I'm doing something inefficiently, please don't judge me, but do let me know. :)

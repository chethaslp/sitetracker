<p align="center"><img src="https://raw.githubusercontent.com/chethaslp/sitetracker/main/Screenshots/title.png"/></p>
  
## Usage
Remember when you constanly had to look for updates in a site with important informations. It probably don't have notification/email-to-you feature. In this situation, Sitetracker is what you could use. Sitetracker checks for updates in your site every hour and emails you about the change in the site, if found.

#### Site availabe at https://sitetracker.vercel.app

## Implementation
Sitetracker has a cron background process which runs independent of the app . Sitetracker uses Firebase as Baas. Authentication is also handled by firebase.

<img src ="https://raw.githubusercontent.com/chethaslp/sitetracker/main/Screenshots/1.png"/>
    
#### Cron Process
  Sitetracker works all its magic in the backend cron job (currently deployed using github actions).
  This process checks for updates in every site, and email the user who added the site about the update. Differencial algorithm is used for finding changes.
  
 [![Sitetracker Cron Workflow](https://github.com/chethaslp/sitetracker/actions/workflows/main.yml/badge.svg)](https://github.com/chethaslp/sitetracker/actions/workflows/main.yml)

## TODO
 * Redundancy is found in DB. (to be fixed)

       [url, email, d, t] --> [url, [email1,email2, ...], d, t]

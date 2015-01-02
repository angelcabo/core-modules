# [Parallels](http://parallels.io) alpha app, based on [Meteor JS](http://www.meteor.com)
---  

### Dependencies + Requirements

* OSX / Linux
* Node (tested with v0.10.29)
* NPM (tested with v1.4.14) 
* Meteor 1.0+
* git, prefer 2.0+
* [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating) browsers: Chrome, IE10+, Safari, FireFox


---  
### Quick Start: Building + Developing


#### Install node.js + NPM ( [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) ) ( [Linux via Apt ](https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server) )




```

# to install Meteor:
$ curl install.meteor.com | sh

```

  
  


```

# enter the directory where you store your code:
$ mkdir your-code-directory         # if it doesn't yet exist
$ cd your-code-directory

```


```

# once inside, pull down the latest project files:
$ git clone https://github.com/parallelsio/app-meteor.git

```


```

# set up your settings: copy the defaults 
$ cp settings.json.sample settings.json

# edit the settings.json to configure your options

```


```

# start local server which loads up test dataset automatically
$ meteor run --settings settings.json

# Browse site at http://localhost:3000


```





## Contact + tools we use

* twitter: [@makeparallels](http://www.twitter.com/makeparallels)
* [Slack](http://parallelsio.slack.com) for chat/collab
* [PivotalTracker](http://www.pivotaltracker.com) for keeping track of stories, units of development work


## Contribute

We're a diverse, distributed team of designers, developers and researchers with a goal of changing the way we organize and connect ideas. We'd love you to join us: get in touch if would like to contribute. No contribution is too small.


Current challenges:

* A zoomable/panning user interface with coordinate system for map-based layout/content
* Modeling documents in graph based data structures with Neo4J
* Decentralized (no-cloud) infrastructure / file storage
* Browser extensions for clipping web content
* Matrix transformations-heavy, physics-based interactions with GreenSock JS
* Interactive documentation, think Bret Vector reactive documents
* iOS / Android apps


## Road Map

Coming shortly. 


## License

GNU Affero General Public License. Pay it forward.


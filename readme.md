Node.js app to get list of NCBI-Hackathons shipped software via GitHub api v4.

##### the big idea
Automate the ncbi-hackathons.github.io/index.html page automatically via:
  - auto data-fetch:
    - a node.js app running on zeit.co/now that queries the GitHub api v4 X times a day
    - a javascript front end app that, whenever someone goes to `ncbi-hackathons.github.io/`, builds out the site according to the data in the node.js app above

###### details for the node.js app:
  - get the list of NCBI-Hackathons repos that:
    - of those repos that have at least 1 release:
      - for all repos with an issue with the label "Manuscript"
        - get the body of the issue with the "Manuscript" label

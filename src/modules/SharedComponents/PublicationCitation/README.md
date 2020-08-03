# PublicationCitation

Creates a citation that is placed at the top of a record.

99.2% of pubs have < 31 authors (in 2020). There are some records with > 5000 records!!!

Citations happen in multiple ways in espace:

- search lists have a citation on each result - but due to server constraints (elasticsearch config limit) each result only receives a max of 31 authors per work.
- the header of any record (view record, fix record, claim record, etc)
- the author list on the body of a View work page (not a full citation, but uses the citation code to generate the list)

(There is also the API rek_citation from the DB: API creates rek_citation on the record. This is provided for downstream records, such as https://researchers.uq.edu.au/researcher/1840 and https://social-science.uq.edu.au/profile/2741/cameron-parsell#Journal-Articles but is not used by espace FE.)

Each component which writes a citation will ask for the type of citation they should display by passing a 'citationStyle' prop. Possible values are:

* 'full': this citation is within body of a Work detail page (complete author list, no other citation details)
* 'header': this citation is at top of a Work detail page (citation with max 30 authors - first 29 and last one )
* 'list': this citation is within a list of eg search results (only truncated list of authors provided by API - show first thirty and 'and N more' where more)


using my.bookshop as my from '../db/schema';


/**Creating service for exposing our DB entities to the end users then we will get the end points,it creates one interface. */
service CatalogService {

    entity Books @(restrict: [
        {
            grant: ['*'],
            to   : 'Admin'
        },
        {
            grant: ['READ'],
            to   : 'User'
        }
    ])
  as projection on my.Books;
 
}








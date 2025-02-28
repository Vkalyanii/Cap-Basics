using my.bookshop as my from '../db/schema';


/**Creating service for exposing our DB entities to the end users then we will get the end points,it creates one interface. */
@impl:'srv/bookshop-service.js'
service CatalogService {
    entity Books as projection on my.Books;
}








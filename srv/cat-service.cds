using my.bookshop as my from '../db/schema';


/**Creating service for exposing our DB entities to the end users then we will get the end points,it creates one interface. */
service CatalogService {

    entity Books @(Capabilities:{
        InsertRestrictions.Insertable:false, //inserting data will be not allowed
        UpdateRestrictions.Updatable:false,  //updating data will be not allowed
        DeleteRestrictions.Deletable:false   //deleting data will be not allowed
        //@Capabilities.SortRestrictions.Sortable: true → Enables sorting.
        //@Capabilities.FilterRestrictions.Filterable: false → Disables filtering.
        //@Capabilities.NavigationRestrictions.RestrictedProperties → Blocks navigation.
        //@Capabilities.SearchRestrictions.Searchable: false/*
    }) as projection on my.Books;
 
}








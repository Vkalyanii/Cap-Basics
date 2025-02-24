sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("com.app.capbasics.controller.Home", {

        // onInit function is called when the view is initialized.
        // It sets an empty JSON model for storing book data.
        onInit: function () {
            const oModel = new JSONModel({ ID: "", title: "", stock: "" });  // Initialize model with empty book data
            this.getView().setModel(oModel, "BooksModel");  // Set the model to the view
        },

        // Handler for the "Add" button.
        // It checks if any rows are selected and opens the "Create Book" dialog.
        async onAddPress() {
            let oSelected = this.byId("booksTable").getSelectedItems();  // Get selected rows from the table
            if (oSelected.length > 0) {
                // If there are selected rows, show a warning message
                return MessageBox.warning("Please unselect any selected items.");
            }

            // Load the "Create Book" dialog fragment if not already loaded
            this.oDialog ??= await this.loadFragment({ name: "com.app.capbasics.fragments.createBook" });
            this.oDialog.open();  // Open the dialog for creating a new book
        },

        // Function to close the "Create Book" dialog and reset the model
        onCancel() {
            this.getView().getModel("BooksModel").setProperty("/", {});  // Reset model data
            this.oDialog.close();  // Close the dialog
        },

        // **** Handler for the "Delete" button
        // It deletes selected items from the table
        ondeletePress() {
            const oSelected = this.byId("booksTable").getSelectedItems(),  // Get selected rows from the table
                oModel = this.getView().getModel();  // Get the model for data

            if (oSelected.length < 1) {
                // If no rows are selected, show a warning message
                return MessageBox.warning("Please select at least one item for deletion.");
            }

            // Loop through each selected row and remove it from the model
            oSelected.forEach(Item => {
                let sPath = Item.getBindingContext().getPath();  // Get the path of the selected item
                oModel.remove(sPath, {  // Remove the item from the model
                    success: function () {
                        // On successful deletion, show a success message
                        MessageToast.show("Successfully deleted.");
                        this.byId("booksTable").getBinding("items").refresh();  // Refresh the table view
                    }.bind(this),
                    error: function () {
                        // On error during deletion, show an error message
                        MessageBox.warning("An error occurred during deletion.");
                        this.byId("booksTable").getBinding("items").refresh();  // Refresh the table view
                    }.bind(this)
                });
            });
        },

        // *** Function to create a new book record
        onCreateBookPress: function () {
            const oPayload = this.getView().getModel("BooksModel").getProperty("/"),  // Get the book data from the model
                oModel = this.getView().getModel(),  // Get the main model (should be an OData model)
                sPath = "/Books";  // Path to the "Books" entity

            // Uncomment the code below to add validation for mandatory fields
            // if (!oPayload.title || !oPayload.stock) {
            //     return MessageBox.warning("Please enter mandatory fields.");
            // }

            // Create a new record in the backend using the OData model
            oModel.create(sPath, oPayload, {
                success: function () {
                    // On successful creation, show a success message
                    MessageToast.show("Created successfully.");
                    this.byId("booksTable").getBinding("items").refresh();  // Refresh the table view
                    this.onCancel();  // Close the dialog
                }.bind(this),
                error: function () {
                    // On error during creation, show an error message
                    MessageBox.error("An error occurred while creating the record.");
                    this.byId("booksTable").getBinding("items").refresh();  // Refresh the table view
                    this.onCancel();  // Close the dialog
                }.bind(this)
            });
        },

        /** Edit Fragment */
        async onEditPress() {
            let oSelectedItem = this.byId("booksTable").getSelectedItem();  // Get selected item in the table
            if (!oSelectedItem) {
                return MessageBox.warning("Please select a book to edit.");
            }

            let sPath = oSelectedItem.getBindingContext().getObject();  // Get the path of the selected item

            // Load the "Edit Book" dialog fragment if not already loaded
            this.oDialogUpdate ??= await this.loadFragment({
                name: "com.app.capbasics.fragments.edit"
            });

            // Bind the selected item to the edit fragment
            // this.oDialogUpdate.bindElement({
            //     path: sPath,
            //     model: "BooksModel"
            // });

            this.getView().getModel("BooksModel").setData(sPath);
            this.oDialogUpdate.open();  // Open the dialog for editing the book
        },

        // Function to cancel editing and close the dialog
        onCancelEditPress() {
            this.getView().getModel("BooksModel").setProperty("/", {});  // Reset model data
            this.oDialogUpdate.close();  // Close the dialog
        },

        // Function to update the selected book data
        onSaveEditPress() {
            let oTable = this.byId("booksTable");
            let oBinding = oTable.getBinding("items");
            let oSelectedItem = oTable.getSelectedItem();  // Get selected item in the table
            if (!oSelectedItem) {
                return MessageBox.warning("Please select a book to update.");
            }

            let sPath = oSelectedItem.getBindingContext().getPath();  // Get the path of the selected item
            let oPayload = this.getView().getModel("BooksModel").getProperty("/");  // Get the updated data from the model

            let oModel = this.getView().getModel();  // Get the OData model
            
            // Update the existing record using the OData model
            oModel.update(sPath, oPayload, {
                success: function () {
                    MessageToast.show("Successfully updated.");
                    oBinding.refresh();  // Refresh the table view
                    this.onCancelEditPress();  // Close the dialog
                }.bind(this),
                error: function () {
                    MessageBox.warning("Error occurred while updating.");
                    oBinding.refresh();  // Refresh the table view
                    this.onCancelEditPress();  // Close the dialog
                }.bind(this)
            });
        }
    });
});

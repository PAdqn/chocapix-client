var AdminFoodCreation = require('./newitem.po.js');
var BarsBarPage = require('../../bar/bar.po.js');

describe('Food creation inter-bars', function() {
    var adminFoodCreation = new AdminFoodCreation();
    var barsBarPage = new BarsBarPage();

    it('should create a simple food existing in an other bar', function() {
        barsBarPage.changeToBar('Natation Jône');

        adminFoodCreation.go();

        // Code barre existant en aviron jone
        adminFoodCreation.setBarcode('123');
        expect(adminFoodCreation.isBarcodeErrorDisplayed()).toBe(false);

        // On vérifie que les infos sont bien récupérés
        expect(adminFoodCreation.getItemDetailsName()).toEqual('Coca-Cola');
        expect(adminFoodCreation.getItemDetailsNamePlural()).toEqual('Coca-Cola');
        expect(adminFoodCreation.getItemDetailsContainer()).toEqual('Canette');
        expect(adminFoodCreation.getItemDetailsContainerPlural()).toEqual('Canettes');
        expect(adminFoodCreation.getItemDetailsUnit()).toEqual('cl');
        expect(adminFoodCreation.getItemDetailsContainerQty()).toEqual('33');

        // On vérifie qu'on ne peut pas les modifier
        expect(adminFoodCreation.isItemDetailsNameEnabled()).toBe(false);
        expect(adminFoodCreation.isItemDetailsContainerEnabled()).toBe(false);
        expect(adminFoodCreation.isItemDetailsContainerPluralEnabled()).toBe(false);
        expect(adminFoodCreation.isItemDetailsUnitEnabled()).toBe(false);
        expect(adminFoodCreation.isItemDetailsContainerQtyEnabled()).toBe(false);
        // expect(adminFoodCreation.isPackChoiceEnabled()).toBe(false);

        expect(adminFoodCreation.getItemDetailsPreview()).toEqual('Appro de 4 Canettes de 33 cl de Coca-Cola');

        // Les champs doivent être pré-remplis à partir des informations de l'ItemDetails
        expect(adminFoodCreation.getSellItemName()).toEqual('Coca-Cola');
        expect(adminFoodCreation.getSellItemNamePlural()).toEqual('Coca-Cola');
        expect(adminFoodCreation.getSellItemUnitName()).toEqual('cl');
        expect(adminFoodCreation.getSellItemUnitNamePlural()).toEqual('cl');
        expect(adminFoodCreation.getStockItemSellToBuy()).toEqual('33');

        // On modifie ces champs
        adminFoodCreation.setSellItemUnitName('canette', true);
        adminFoodCreation.setSellItemUnitNamePlural('s');
        adminFoodCreation.setStockItemSellToBuy('1', true);

        adminFoodCreation.setPrice('0.5');

        expect(adminFoodCreation.getSellItemPreview()).toEqual('Achat de 53 canettes de Coca-Cola pour 31,80 €');

        adminFoodCreation.clickValidate();

        expect(adminFoodCreation.getLastAlert()).toMatch(/L'aliment a été correctement créé\./);
        adminFoodCreation.closeLastAlert();
    });
});

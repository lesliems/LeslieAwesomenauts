game.MiniMap = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, "init", [x, y, {
                image: "minimap",
                width:542,
                height:175,
                spritewidth:"542",
                spriteheight:"175",
                getShape: function(){
                    return(new me.Rect(0, 0, 542, 175)).toPolygon();
                }
        }]);
        this.floating = true;
    
    }
});

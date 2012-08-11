/**
 * This is the main code for the application
 */

Ext.Loader.setConfig({
	enabled:true
});
Ext.application({
    name: 'MyApp',

	requires:['MyApp.view.BouncingBall'], 
	
    launch: function() {
		var gameSurface = Ext.create('MyApp.view.BouncingBall'); 
     	Ext.create('Ext.Window',{
			title		: 'Drawing and charting',
			frame		: false,
			resizable	:false,
			layout		: 'fit',
			items:[gameSurface],
			bbar:['<b>BRICKBREAKER</b>','->',{
					iconCls:'play',
					scale:'large',
					handler:function(){
						gameSurface.initMovement();
					}					
				},{
					iconCls:'pause',
					scale:'large',
					handler:function(){
						gameSurface.pauseMovement();
					}
				},{
					iconCls:'mute',
					scale:'large',
					handler:function(){
						gameSurface.muteSound();
					}
				}]
		}).show();		
    }
});
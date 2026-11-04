<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xmlns:se="http://www.opengis.net/se" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <se:Name>cuencas_pba_p07</se:Name>
    <UserStyle>
      <se:Name>cuencas_pba_p07</se:Name>
      <se:FeatureTypeStyle>

        <se:Rule>
          <se:Name>Single symbol</se:Name>
          <se:MinScaleDenominator>1</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000000</se:MaxScaleDenominator>		  		  
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ff9e17</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#0b704b</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>Single symbol</se:Name>
          <se:MinScaleDenominator>1000000</se:MinScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ff9e17</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#0b704b</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000000</se:MaxScaleDenominator>
          <se:TextSymbolizer>
      <se:Geometry>
        <ogc:Function name="centroid">
        <ogc:PropertyName>the_geom</ogc:PropertyName>
        </ogc:Function>
      </se:Geometry>
            <se:Label>
              <ogc:PropertyName>cod_letras</ogc:PropertyName>
              <ogc:PropertyName>subregion</ogc:PropertyName>              
            </se:Label>
            <se:Font>
              <se:SvgParameter name="font-family">Encode Sans Condensed Medium</se:SvgParameter>
              <se:SvgParameter name="font-size">10</se:SvgParameter>
            </se:Font>
            <se:LabelPlacement>
              <se:PointPlacement>
                <se:AnchorPoint>
                  <se:AnchorPointX>0.5</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
              </se:PointPlacement>
            </se:LabelPlacement>
            <se:Fill>
              <se:SvgParameter name="fill">#0b704b</se:SvgParameter>
            </se:Fill>
            <se:VendorOption name="maxDisplacement">0.5</se:VendorOption>
          </se:TextSymbolizer>
        </se:Rule>        
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
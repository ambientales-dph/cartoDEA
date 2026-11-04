<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>muestreo_de_suelos</Name>
    <UserStyle>
      <Name>burg</Name>
      <Title></Title>
      <Abstract>A sample of how to use an SVG based symbolizer</Abstract>

      <FeatureTypeStyle>
		
		<Rule>
          <Title>Muestreo de Suelos</Title>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="file:////var/lib/tomcat7/webapps/geoserver/data/styles/muestreo_suelos.svg" />
                <Format>image/svg+xml</Format>
              </ExternalGraphic>
              <Size>
                <ogc:Literal>14</ogc:Literal>
              </Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <Rule>
          <MaxScaleDenominator>250000</MaxScaleDenominator>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>etiqueta</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Encode Sans Condensed Medium</CssParameter>
              <CssParameter name="font-size">9</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0</AnchorPointX>
                  <AnchorPointY>0</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>-5</DisplacementX>
                  <DisplacementY>-15</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Fill>
              <CssParameter name="fill">#cc0000</CssParameter>
            </Fill>
          </TextSymbolizer>
        </Rule>        
                                
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
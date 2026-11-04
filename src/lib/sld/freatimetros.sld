<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>red flag</Name>
    <UserStyle>
      <Name>burg</Name>
      <Title>A small red flag</Title>
      <Abstract>A sample of how to use an SVG based symbolizer</Abstract>

      <FeatureTypeStyle>
        <Rule>
          
          <Title>Agua Dulce</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>conduct</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>0</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>1500</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="file:////var/lib/tomcat7/webapps/geoserver/data/styles/agua_dulce.svg" />
                <Format>image/svg+xml</Format>
              </ExternalGraphic>
              <Size>
                <ogc:Literal>14</ogc:Literal>
              </Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

		<Rule>
          <Title>Agua Levemente Salobre</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>conduct</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>1500</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>2250</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PointSymbolizer>
             <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="file:////var/lib/tomcat7/webapps/geoserver/data/styles/agua_levemente_salobre.svg" />
                <Format>image/svg+xml</Format>
              </ExternalGraphic>
              <Size>
                <ogc:Literal>14</ogc:Literal>
              </Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

		<Rule>
          <Title>Agua Salobre</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>conduct</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>2250</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>15000</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PointSymbolizer>
             <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="file:////var/lib/tomcat7/webapps/geoserver/data/styles/agua_salobre.svg" />
                <Format>image/svg+xml</Format>
              </ExternalGraphic>
              <Size>
                <ogc:Literal>14</ogc:Literal>
              </Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
		
		<Rule>
          
          <Title>Agua Salada</Title>
		  <ogc:Filter>
            <ogc:PropertyIsGreaterThan>
             <ogc:PropertyName>conduct</ogc:PropertyName>
             <ogc:Literal>15000</ogc:Literal>
            </ogc:PropertyIsGreaterThan>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:type="simple" xlink:href="file:////var/lib/tomcat7/webapps/geoserver/data/styles/agua_salada.svg" />
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
              <CssParameter name="fill">#00AAFF</CssParameter>
            </Fill>
          </TextSymbolizer>
        </Rule>        
                                
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0" xmlns:sld="http://www.opengis.net/sld">
  <UserLayer>
    <sld:LayerFeatureConstraints>
      <sld:FeatureTypeConstraint/>
    </sld:LayerFeatureConstraints>
    <sld:UserStyle>
      <sld:Name>Manchas_SO_R50</sld:Name>
      <sld:FeatureTypeStyle>
        <sld:Rule>
          <sld:RasterSymbolizer>
            <sld:ChannelSelection>
              <sld:GrayChannel>
                <sld:SourceChannelName>1</sld:SourceChannelName>
              </sld:GrayChannel>
            </sld:ChannelSelection>
            <sld:ColorMap type="ramp">
              <sld:ColorMapEntry quantity="0.0043676449115471" label="0.0 m" color="#f7fbff"/>
              <sld:ColorMapEntry quantity="0.305251246692077" label="0.3 m" color="#bbdaf5"/>
              <sld:ColorMapEntry quantity="0.606134848472606" label="0.6 m" color="#9ecce8"/>
              <sld:ColorMapEntry quantity="0.907018450253136" label="0.9 m" color="#73b3d8"/>
              <sld:ColorMapEntry quantity="1.207902052033665" label="1.2 m" color="#3e8ec4"/>
              <sld:ColorMapEntry quantity="1.508785653814195" label="1.5 m" color="#1563aa"/>
              <sld:ColorMapEntry quantity="1.809669255594724" label="1.8 m" color="#08306b"/>
            </sld:ColorMap>
          </sld:RasterSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </UserLayer>
</StyledLayerDescriptor>
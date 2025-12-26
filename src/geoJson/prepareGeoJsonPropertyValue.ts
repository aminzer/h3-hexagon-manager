const prepareGeoJsonPropertyValue = (propertyValue: string | null | undefined): string | null => {
  if (typeof propertyValue !== 'string') {
    return null;
  }

  if (propertyValue === 'NA') {
    return null;
  }

  return propertyValue;
};

export default prepareGeoJsonPropertyValue;

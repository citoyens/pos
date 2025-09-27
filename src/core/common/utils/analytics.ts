import amplitude from "amplitude-js";

export enum AmplitudeEvent {
  VisitPage = "Page Viewed",
  ReceivePurchaseOrder = "Recibir órden de compra",
  OpenReceiptOrder = "Abrir órden de recepción",
  FinishPurchaseOrderDrawer = "Finalizar recepción de órden de compra (abrir drawer)",
  FinishPurchaseOrder = "Finalizar recepción de órden de compra ",
  ErrorPostingOrder = "Error al reportar orden de compra",
  OpenDeleteProduction = "Abrir modal para eliminar orden de producción",
  ConfirmDeleteProduction = "Confirmar eliminar orden de produccion",
  OpenEditProduction = "Abrir pantalla modificacion produccion",
  SaveEditProduction = "Confirmar actualizacion produccion",
  SearchProductions = "Buscar produccion",
  OpenDeleteTransfer = "Abrir modal para eliminar orden de transferencia",
  // Counting
  InitCounting = "Iniciar Conteo Físico",
  ResumeCounting = "Continuar Conteo Físico",
  FinishCounting = "Finalizar Conteo Físico",
  ViewCountingAccuracy = "Ver Accuracy conteo",
  ExportCounting = "Exportar Conteo Físico",
  // Inventory Comparison
  SelectKitchenComparison = "Seleccionar locación en comparación de inventarios",
  SelectCityComparison = "Seleccionar ciudad en comparación de inventarios",
  SelectCountryComparison = "Seleccionar país en comparación de inventarios",
  SearchProductComparison = "Buscar producto en comparación de inventarios",
  SearchLocationComparison = "Buscar locación en comparación de inventarios",
  ViewProductDetailComparison = "Ver detalle del producto en comparación de inventarios",
}

const logEvent = (
  event: AmplitudeEvent,
  eventProperties?: Record<string, unknown>
): void => {
  amplitude.getInstance().logEvent(event, eventProperties);
};

const setUserProperties = (userProperties: Record<string, unknown>): void => {
  amplitude.getInstance().setUserProperties(userProperties);
};

const setUserId = (userId: string): void => {
  amplitude.getInstance().setUserId(userId);
};

const initAnalytics = (): void => {
  amplitude.getInstance().init(`${process.env.REACT_APP_AMPLITUDE_APY_KEY}`);
};

export { initAnalytics, logEvent, setUserId, setUserProperties };

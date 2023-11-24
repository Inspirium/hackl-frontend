export default function ({ $echo }) {
  // Echo is available here
  $echo.connector.pusher.connection.strategy.transports.wss.transport.manager.livesLeft = Infinity
}

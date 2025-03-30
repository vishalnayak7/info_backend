export const compression_options = (compression) => {
     return {

          level: 6,
          filter: (req, res) => {
               if (req.headers['x-no-compression']) {
                    return false
               }
               return compression.filter(req, res)
          }
     }
}
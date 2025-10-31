// const request = async <T>(
//     method: Operation,
//   url: string,
//   body?: unknown
//   //   config: RequestConfig = {}
// ): Promise<T> => {
//   //   const headers = await createHeaders();
//   try {
//     const response = await fetch(url, {
//       method: method.toUpperCase(),
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: processedBody,
//       ...config,
//     });

//     let responseBody = undefined;

//     responseBody = await response.json().catch(() => null); // JSON 파싱 실패 대비

//     if (!response.ok) {
//       throw new CustomNetworkError(
//         response.status,
//         `Request Failed: [${response.status} ${responseBody}]`,
//         metadata
//       );
//     }
//     return response.headers.get("content-length") === "0"
//       ? ({} as T)
//       : responseBody;
//   } catch (error) {
//     throw error;
//   }
// };
// export default request;

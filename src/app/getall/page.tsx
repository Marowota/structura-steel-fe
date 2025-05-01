"use client";

import { useEffect } from "react";
import axios from "axios";

export default function GetAll() {
  useEffect(() => {
    async function fetchAll() {
      const config = {
        params: {
          pageNo: 0,
          pageSize: 10,
          sortBy: "id",
          sortDir: "asc",
        },
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlSjJMTmFFcUltNm9scGhrY2NnU2JYRGhJNzlwa0FRMUNXS3VxQ0lYNlZrIn0.eyJleHAiOjE3NDU4NTc2MDIsImlhdCI6MTc0NTg1NzMwMiwianRpIjoiNTRjODc5Y2QtMzY0MC00YjM4LTliMDctNTE3NDAxM2UzMzRiIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDA4L3JlYWxtcy9zdHJ1Y3R1cmEiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTQxNjkyMTItZjU1Yi00MDc1LWE4NmMtMTdmNmJlZTU0MWIzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3RydWN0dXJhLXN0ZWVsLWNsaWVudCIsInNpZCI6IjkxYzBhZmQ4LTg0NGYtNGY5Zi1hNzY4LTFhZjIyZjlhYmIzNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJST0xFX0FETUlOIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXN0cnVjdHVyYSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWFhIGJiYiIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6ImFhYSIsImZhbWlseV9uYW1lIjoiYmJiIiwiZW1haWwiOiJhYmNAZ2cuY29tIn0.JUD4xNQ0poRjBbtFbdF9HnAbIfh6h2BUuBMSdJk52uQFSARr1bXaqWJRALQROv3I9_avw6bmkOJmQehIU1c3IpJ8KtOOh9LqEuyUCEQDtbPq0XOdnGH5kcdtBROVjsQemivofYvmyJ4bPG8wkCUMBUVAzkbZnql9iF9ojxs3S9GO4MdYgSswV4GiXtDthrAYxdw1ozKr8IW82ptlUYBmQXMkHVTDTDtZeDz3XpBvKrHOA3wvxJGsKZirlErL03wBg7h9Rttl_i4M1la5qls2vo1uAXb-iEokJhuAsyirJ_OZ5aAX78reLuNq1vFB6v8a91cpx42aTxpfrl0C2cP0NQ",
        },
      };

      try {
        const [saleRes, productsRes, partnersRes] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/core/sale/1/details", config),
          axios.get("http://localhost:8000/api/v1/products", config),
          axios.get("http://localhost:8000/api/v1/partners", config),
          axios.post(
            "http://localhost:8000/api/v1/products/",
            {
              code: "PRO982",
              name: "Product 2",
              unitweight: 0.6,
              length: 22.0,
              width: 6.0,
              thickness: 0.15,
              diameter: 12.0,
              standard: "STD802",
            },
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlSjJMTmFFcUltNm9scGhrY2NnU2JYRGhJNzlwa0FRMUNXS3VxQ0lYNlZrIn0.eyJleHAiOjE3NDU4NTc2MDIsImlhdCI6MTc0NTg1NzMwMiwianRpIjoiNTRjODc5Y2QtMzY0MC00YjM4LTliMDctNTE3NDAxM2UzMzRiIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDA4L3JlYWxtcy9zdHJ1Y3R1cmEiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTQxNjkyMTItZjU1Yi00MDc1LWE4NmMtMTdmNmJlZTU0MWIzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3RydWN0dXJhLXN0ZWVsLWNsaWVudCIsInNpZCI6IjkxYzBhZmQ4LTg0NGYtNGY5Zi1hNzY4LTFhZjIyZjlhYmIzNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJST0xFX0FETUlOIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXN0cnVjdHVyYSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWFhIGJiYiIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6ImFhYSIsImZhbWlseV9uYW1lIjoiYmJiIiwiZW1haWwiOiJhYmNAZ2cuY29tIn0.JUD4xNQ0poRjBbtFbdF9HnAbIfh6h2BUuBMSdJk52uQFSARr1bXaqWJRALQROv3I9_avw6bmkOJmQehIU1c3IpJ8KtOOh9LqEuyUCEQDtbPq0XOdnGH5kcdtBROVjsQemivofYvmyJ4bPG8wkCUMBUVAzkbZnql9iF9ojxs3S9GO4MdYgSswV4GiXtDthrAYxdw1ozKr8IW82ptlUYBmQXMkHVTDTDtZeDz3XpBvKrHOA3wvxJGsKZirlErL03wBg7h9Rttl_i4M1la5qls2vo1uAXb-iEokJhuAsyirJ_OZ5aAX78reLuNq1vFB6v8a91cpx42aTxpfrl0C2cP0NQ",
              },
            },
          ),
        ]);

        console.log("SALE DETAILS:", saleRes.data);
        console.log("PRODUCTS:", productsRes.data);
        console.log("PARTNERS:", partnersRes.data);
      } catch (error) {
        console.error("ERROR FETCHING APIS:", error);
      }
    }

    fetchAll();
  }, []);

  return null;
}

import driver from "../../lib/neo4j";
import { QueryResult, Session, Record } from "neo4j-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { EmployeeNode } from "@/types/neo4j";

const DATA_VARIABLE = "employee";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session: Session = driver.session();
  const query = `MATCH (e:Employee) WHERE e.employeeId = "${id}" RETURN e as ${DATA_VARIABLE}`;

  try {
    const result: QueryResult = await session.run(query);
    const records: Record[] = result.records;
    const employeeNode: EmployeeNode = records[0].get(DATA_VARIABLE);
    res.status(200).json(employeeNode);
  } catch (error) {
    console.error("Error fetching data from Neo4j:", error);
  } finally {
    await session.close();
  }
};

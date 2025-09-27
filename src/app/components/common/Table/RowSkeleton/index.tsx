import { CustomTableRow } from "@foodology-co/alejandria";
import { Skeleton, TableCell } from "@mui/material";

interface Props {
  rowsNumber: number;
  columnsNumber: number;
}

const TableRowSkeleton = (props: Props) => {
  const { rowsNumber, columnsNumber } = props;

  return (
    <>
      {Array.from(Array(rowsNumber)).map((_, i) => (
        <CustomTableRow key={`Row-Skeleton-${i}`}>
          {Array.from(Array(columnsNumber)).map((_, j) => (
            <TableCell key={`Header-Skeleton-${i}-${j}`} align={"left"}>
              <Skeleton />
            </TableCell>
          ))}
        </CustomTableRow>
      ))}
    </>
  );
};

export default TableRowSkeleton;

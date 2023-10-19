from enum import Enum
from typing import Dict, List, Union

from fastapi import Query
from pydantic import dataclasses
from sqlmodel.main import SQLModelMetaclass


class SortDirection(str, Enum):
    asc = "asc"
    desc = "desc"


@dataclasses.dataclass
class SortOptions:
    sort: List = Query(
        default=None,
        description="field-0: sort column<br/>field-1: order ('asc' or 'desc')",
    )

    def get_sa_sort_list(
        self,
        sa_table,
        mapping: Dict[str, Union[str, SQLModelMetaclass]] = None,
        default=["id", SortDirection.asc],
    ) -> List:
        sort = (
            self.sort
            if isinstance(self.sort, List) and len(self.sort) >= 2
            else default
        )
        sort_list = []
        for i in range(0, len(sort), 2):
            sort_field, sort_type = sort[i : i + 2]

            sort_column = (
                mapping.get(sort_field) or sort_field if mapping else sort_field
            )
            if isinstance(sort_column, str):
                sort_column = getattr(sa_table, sort_column)

            sort_list.append(
                sort_column.desc()
                if sort_type and sort_type == SortDirection.desc
                else sort_column.asc()
            )
        return sort_list

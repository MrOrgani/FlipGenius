import { Editable, EditablePreview, EditableTextarea } from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Form } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui//table";

export const WordList = ({ words = "", editable = false }) => {
  const [dictionary, setDictionary] = useState<Record<string, Word>>(
    words ? Object.fromEntries(JSON.parse(words)) : {}
  );

  const handleAddNewWord = () => {
    setDictionary((prevDictionary) => ({
      ...prevDictionary,
      "Enter a word": { definition: "and its definition", successRate: 0 },
    }));
  };

  return (
    <>
      <Table className=" overflow-hidden overflow-x-hidden">
        <TableHeader className=" ">
          <TableRow>
            <TableHead>Word</TableHead>
            <TableHead>Definition</TableHead>
            <TableHead>Success Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="p-4">
          {dictionary &&
            Object.entries(dictionary).map(
              ([word, { definition, successRate }], index) => (
                <TableRow
                  key={`word-${index}`}
                  className="m-4 odd:bg-white hover:border-2  hover:border-blue-500"
                >
                  <TableCell>
                    <Editable defaultValue={word}>
                      <EditablePreview width="full" />
                      <EditableTextarea
                        onChange={(e) => {
                          const { [word]: value, ...common } = dictionary;

                          setDictionary({
                            [e.target.value]: { definition, successRate },
                            ...common,
                          });
                        }}
                      />
                    </Editable>
                  </TableCell>
                  <TableCell>
                    <Editable defaultValue={definition} className="grow">
                      <EditablePreview width="full" className="grow" />
                      <EditableTextarea
                        width={"-moz-available"}
                        className="grow"
                        onChange={(e) => {
                          setDictionary({
                            ...dictionary,
                            [word]: {
                              definition: e.target.value,
                              successRate: dictionary[word].successRate,
                            },
                          });
                        }}
                      ></EditableTextarea>
                    </Editable>
                  </TableCell>
                  <TableCell className="flex">
                    {successRate}%
                    <button
                      className="ml-auto"
                      onClick={() => {
                        const tempDictionary = {
                          ...dictionary,
                        };
                        delete tempDictionary[word];
                        setDictionary({
                          ...tempDictionary,
                        });
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
      {editable ? (
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleAddNewWord}
            className=" text-md  font-subtitle w-fit rounded-full bg-white px-8 py-2 "
            type={"button"}
          >
            + Add a new word
          </button>

          <Form method={"PUT"} id="save-word-list">
            <button
              className=" text-md  font-subtitle w-fit rounded-full bg-green-400 px-8 py-2 font-bold text-white "
              type={"submit"}
            >
              💾 Save
            </button>
            <input
              type="hidden"
              name="wordList"
              value={
                dictionary && Object.entries(dictionary)?.length
                  ? JSON.stringify(
                      Object.entries(dictionary).filter(
                        ([word]) => word !== "Enter a word"
                      )
                    )
                  : JSON.stringify([])
              }
            ></input>
          </Form>
        </div>
      ) : null}
    </>
  );
};

import React, {useEffect, useState, useCallback} from 'react';

import Navbar from "./BoardNav";
import LeaderBoard from "./LeaderBoard";
import {Player, Board} from "../../types"
import {RouteComponentProps} from 'react-router-dom';
import Loading from "../common/Loading";

import {
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useBoards} from './BoardProvider'


function PlayerEdit(props: Player) {
  return (
    <div className="flex flex-row py-3 justify-items-stretch">
      <div className="flex-grow mr-2">
        <input
          className="w-full p-1 border border-gray-400 rounded-sm appearance-none focus:border-blue-500 focus:outline-none"
          value={props.name}
        />
      </div>
      <div className="flex-none w-20 text-right">
        <input
          className="w-full p-1 border border-gray-400 rounded-sm appearance-none focus:border-blue-500 focus:outline-none"
          value={props.score}
        />
      </div>
      <div className="self-center flex-none w-4 text-right">
        <FontAwesomeIcon icon={faTimes} className="text-gray-500 cursor-pointer" />
      </div>
    </div>
  )
}


type Props = RouteComponentProps<{id: string}> & {}

export default function BoardDetail(props: Props) {
  const [board, setBoard] = useState<Board | void>()
  const { fetchBoardById, fetching } = useBoards()
  const { id } = props.match.params

  const backToList = useCallback(() => props.history.push("/boards"), [props.history])

  useEffect(() => {
    fetchBoardById(id)
      .then((board) => {
        setBoard(board)
      })
    .catch(backToList)
  }, [fetchBoardById, id, backToList])


  return (<>
      <Navbar />
      { fetching ? <Loading /> : board && (
      <section className="container px-4 mx-auto mt-6">
        <div className="flex flex-wrap bg-gray-100 shadow">
          <div className="flex-none w-full max-w-md px-6 py-16 text-sm bg-white shadow-inner">
            <div className="flex flex-col">
              <div className="mb-4">
                <label className="inline-block mb-2 font-bold leading-relaxed">
                  Name of board
                </label>
                <input
                  className="block w-full px-2 py-2 leading-tight border border-gray-400 rounded-sm appearance-none focus:border-blue-500 focus:outline-none"
                  value={board.name}
                />
              </div>

              <div className="mb-4">
                <label className="inline-block mb-2 font-bold leading-relaxed">
                  Short link
                </label>
                <div
                  className="block w-full px-3 py-3 leading-tight border border-gray-400 rounded-sm appearance-none hover:border-blue-500"
                >
                  <span className="text-gray-700">{"https://metaboard.net/s/"}</span>
                  <input
                    className="ml-1 uppercase border-none outline-none"
                    placeholder="CODE"
                    maxLength={10}
                    value={board.code}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="inline-block mb-2 font-bold leading-relaxed">
                  Board type
                </label>
                <div className="relative">
                  <select className="block w-full px-2 py-3 leading-tight border border-gray-400 rounded-sm appearance-none focus:outline-none focus:bg-white focus:border-blue-500"
                  disabled>
                    <option value="leaderboard">Leaderboard</option>
                    <option value="scoreboard">Scoreboard</option>
                    <option value="counter">Counter</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 bg-gray-300 border border-gray-400 rounded-r-sm pointer-events-none">
                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="inline-block mb-2 font-bold leading-relaxed">
                  Board items
                </label>
                { board.items && board.items.map(d => <PlayerEdit {...d} key={d.id} />) }
              </div>
              <div>
                <div className="self-center w-full px-4 py-2 text-center text-white bg-blue-500 rounded-full shadow cursor-pointer hover:opacity-75">
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add more
                </div>
              </div>
            </div>
          </div>
          <LeaderBoard {...board} />
        </div>
      </section>)}
    </>)
}

import CardContainer from "./friends-list/CardContainer";
import CardPerson from "./friends-list/CardPerson";
import { useQuery } from "@tanstack/react-query";
import {
	getFriends,
	QueryResponseType,
} from "@/lib/services/firebase-firestore/friends-list";
import { useContext } from "react";
import { ContextGlobal } from "@/lib/context/global.context";
import FriendsListSkeleton from "./FriendsList.skeleton";
import { FriendType } from "@/lib/definition/friends-list.type";
import { FirestoreError } from "firebase/firestore";
import ErrorUI from "./ErrorUI";

export default function FriendsList() {
	const { currentUser } = useContext(ContextGlobal);
	const { data, error, isError, isLoading } = useQuery<
		any,
		QueryResponseType<FirestoreError | Error>,
		QueryResponseType<FriendType[]>
	>({
		queryKey: ["friendsList"],
		queryFn: () => getFriends(currentUser!.uid),
	});
	if (isLoading) return <FriendsListSkeleton />;
	if (isError) return <ErrorUI message={error.message} data={error.data} />;
	if (data?.data?.length == 0)
		return (
			<CardContainer>
				<h2 className="text-justify">
					Oh my, you don't have friends, even just one? Pathetic!
				</h2>
			</CardContainer>
		);
	return (
		<CardContainer>
			{data?.data?.map((person) => (
				<CardPerson key={person.id} person={person} />
			))}
		</CardContainer>
	);
}

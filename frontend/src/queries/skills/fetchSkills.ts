// import { graphql, NamedProps, QueryProps } from 'react-apollo';
// import { SKILLS_QUERY } from "../../graphql/skills";


// type Skill = {
//     id: number,
//     name: string
// };

// type Response = {
//     skills: Skill[]
// }

// type InputProps = {
//     name: string
// };
// type Variables = {
//     name: string
// };


// const fetchSkills = graphql<InputProps, Response, Variables, Response>(SKILLS_QUERY, {
//     name: 'fetchSkills',
//     options: props => ({
//         variables: {term: props.term},
//         context: {needAuth: false},
//         delay: true
//     }),
//     props: ({fetchSkills}: NamedProps<{fetchSkills: QueryProps & Response}, InputProps>): Response => {
//         return fetchSkills;
//       }
// });

// export default fetchSkills;
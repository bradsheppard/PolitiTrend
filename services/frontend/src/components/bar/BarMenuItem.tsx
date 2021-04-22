import { ListItem } from '@material-ui/core'
import Link from 'next/link'
import * as React from 'react'

interface Props {
    link: string
    text: string
}

const BarMenuItem: React.FC<Props> = (props: Props) => {
    return (
        <Link href={props.link} passHref>
            <ListItem>{props.text}</ListItem>
        </Link>
    )
}

export default BarMenuItem

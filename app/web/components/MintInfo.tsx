import {
  Mint,
} from '@solana/spl-token';

export default function MintInfo(props : { mintInfo: Mint | undefined, classes?: string[] } = { mintInfo: undefined, classes: [] }) {
  if (props.mintInfo && props.mintInfo.address) {
    return (
      <div className="flex flex-col justify-start items-start text-left">
        <label>Address <div>{props.mintInfo.address.toString()}</div></label>
        <br />
        <label>Freeze Authority <div>{props.mintInfo.freezeAuthority ? props.mintInfo.freezeAuthority.toString() : "None"}</div></label>
        <br />
        <label>Mint Authority <div>{props.mintInfo.mintAuthority ? props.mintInfo.mintAuthority.toString() : "None"}</div></label>
        <br />
        <label>Decimals <div>{props.mintInfo.decimals ? props.mintInfo.decimals : "None"}</div></label>
      </div>
    )
  }

  return (
    <></>
  )
};
import React, { useContext, useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IoClose } from "react-icons/all";
import { PrimaryButton, PrimaryInput, PrimaryTextField, RadioLabel, RadioLabelText } from "../../assets/css/components";
import { Loader } from "../Loader";
import { Autocomplete, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { resizeFileImage, uploadMediaToIPFS } from "../../utils/media";
import { mediaURL } from "../../utils/transform";
import { useNavigate } from "react-router-dom";
import { NearContext } from "../../context/NearContext";

export const NewGroupPopup = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const near = useContext(NearContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isMediaLoading, setIsMediaLoading ] = useState(false);
  const [ formData, setFormData ] = useState({
    title: "",
    logo: "",
    group_type: "",
    members: [],
  });

  useEffect(() => {
    resetForm();
  }, [ isOpen ]);

  const resetForm = () => {
    setIsLoading(false);
    setIsMediaLoading(false);
    setFormData({
      title: "",
      logo: "",
      group_type: "",
      members: [],
    });
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const resizeImage = (e) => {
    setFormData({ ...formData, logo: "" })

    const image = e.target.files[0];
    resizeFileImage(image, 600, 600).then(blobData => {
      setIsMediaLoading(true);

      uploadMediaToIPFS(blobData).then(result => {
        setFormData({ ...formData, logo: result });
        setIsMediaLoading(false);
      }).catch(() => setIsMediaLoading(false));
    });
  };

  const changeMemberList = (event, inputs) => {
    setFormData({ ...formData, members: inputs });
  }

  const handleCreateGroup = () => {
    console.log(`formData`, formData);

    if (formData.title.length < 3) {
      alert("Please provide correct group title");
      return;
    }
    if (!formData.group_type.length) {
      alert("Please select group type");
      return;
    }

    setIsLoading(true);
    near.mainContract.createNewGroup(formData.title, formData.logo, formData.group_type, formData.members)
      .then((result) => {
        navigate(`/my/group/${result}`);
        setIsOpen(false);
      })
      .catch(e => {
        console.log(e);
        alert('Error: Group');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={"md"}
      fullWidth={true}
    >
      <DialogTitle align={"center"} className={"border-b-2 border-gray-700/30 text-gray-100"}>
        <span className={"text-gray-200/80"}>Create New Group</span>
        <div className={"absolute right-4 top-4 opacity-80 hover:opacity-90 cursor-pointer transition text-gray-200"} onClick={handleClose}>
          <IoClose size={26}/>
        </div>
      </DialogTitle>
      <DialogContent className={"mx-2 mt-6 mb-2"}>
        <div className={"p-2 flex flex-row gap-8 text-gray-100"}>
          <label
            className={`flex w-40 h-40 items-center mx-auto bg-gray-700/40 rounded-full text-gray-400 cursor-pointer 
            hover:bg-gray-700/60 transition overflow-hidden shadow-lg`}>
            <PrimaryInput placeholder={"Logo"}
                          type={"file"}
                          accept={"image/*"}
                          className={"hidden"}
                          onChange={(e) => resizeImage(e)}
            />

            {formData.logo ? (
              <img src={mediaURL(formData.logo)} alt="" className={"block w-40 h-40 object-cover"}/>
            ) : (
              <>
                {isMediaLoading ? (
                  <div className={"w-full text-center"}>
                    <div className={"mx-auto w-8"}>
                      <Loader size={"sm"}/>
                    </div>
                    uploading
                  </div>
                ) : (
                  <div className={"w-full text-center"}>Upload Logo</div>
                )}
              </>
            )}
          </label>
          <div className={"flex-1"}>
            <div className={"mb-4"}>
              <PrimaryInput placeholder={"Group Title"}
                            disabled={isMediaLoading}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <RadioGroup className={"mb-4"}
                        disabled={isMediaLoading}
                        onChange={e => setFormData({ ...formData, group_type: e.target.value })}>
              <span className={"text-gray-500 font-medium text-sm mb-1"}>Group Type</span>
              <RadioLabel className={"rounded-t-md"}>
                <FormControlLabel value="Channel" control={<Radio/>} label="Channel"/>
                <RadioLabelText>Broadcast messages to general public audience. <br/>
                  No limit for participants, only you can write
                  messages.</RadioLabelText>
              </RadioLabel>
              <RadioLabel>
                <FormControlLabel value="Private" control={<Radio/>} label="Private Group"/>
                <RadioLabelText>You manage group members, all members can write messages. <br/>
                  Limited by 1000 members.</RadioLabelText>
              </RadioLabel>
              <RadioLabel className={"rounded-b-md"}>
                <FormControlLabel value="Public" control={<Radio/>} label="Public Group"/>
                <RadioLabelText>Public access where anyone can join and write messages. <br/>
                  Limited by 1000 members.</RadioLabelText>
              </RadioLabel>
            </RadioGroup>

            {formData.group_type && formData.group_type !== "Channel" && (
              <div className={"mb-2"}>
                <Autocomplete
                  options={[]}
                  multiple
                  onChange={changeMemberList}
                  freeSolo
                  renderInput={(params) => (
                    <PrimaryTextField
                      {...params}
                      label="Members"
                      disabled={isMediaLoading}
                      placeholder="NEAR Address"
                    />
                  )}
                />
              </div>
            )}

            <div className={"flex justify-between"}>
              <div className={"text-red-400/90 text-sm pt-4"}>
                Payment 0.25 NEAR required
              </div>
              <div className={"text-right"}>
                <PrimaryButton onClick={handleCreateGroup} disabled={isLoading || isMediaLoading}>
                  Create Group
                  {isLoading && (<span className={"ml-2"}><Loader size={"sm"}/></span>)}
                </PrimaryButton>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}